import { AnimatedSuspense } from "+components/AnimatedSuspense";
import { useViewportStableBottom, useViewportStableHeight } from "+hooks/useViewport";
import { useVisualViewportBottom, useVisualViewportHeight } from "+hooks/useVisualViewport";
import { groupBy } from "+utils/groupBy";
import { tw } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import { nanoid } from "nanoid";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
  type ComponentProps,
  type DependencyList,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useDebouncedCallback } from "use-debounce";

type PageOptions = ({ type: "page"; x: number; y: number } | { type: "bottom-sheet" }) & {
  fallback?: ReactNode;
};
type PageState = { onBackPress?: (() => boolean) | undefined };

type PushFunction = (node: ReactNode, options: PageOptions) => Promise<void>;
let pushInstance: PushFunction | null = null;
export async function globalPush(node: ReactNode, options: PageOptions) {
  return await pushInstance?.(node, options);
}
const StackContext = createContext<(node: ReactNode, options: PageOptions) => Promise<void>>(null as never);
const PageContext = createContext<{ pop: () => void; update: (extra: PageState) => void }>(null as never);

export function useNavigatePush() {
  return useContext(StackContext);
}

export function handlePushPage(push: PushFunction, node: ReactNode, after?: () => void) {
  return (event: { clientX: number; clientY: number }) =>
    void push(node, {
      type: "page",
      x: event.clientX,
      y: event.clientY,
    }).then(() => after?.());
}

export function useNavigatePop() {
  return useContext(PageContext).pop;
}

export function useNavigateSetPageState(options: PageState, dependencies: DependencyList = []) {
  const update = useContext(PageContext).update;
  useEffect(() => update(options), dependencies);
}

type Page = {
  id: string;
  node: ReactNode;
  options: PageOptions;
  state: PageState;
  resolve: () => void;
};

type PageListOp = { push: Page; state?: PageState } | { pop: string };

export function StackNavigator({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [ops, setOps] = useState<PageListOp[]>([]);
  const push = useCallback((node: ReactNode, options: PageOptions) => {
    const id = nanoid();
    return new Promise<void>((resolve) =>
      setOps((ops) => [...ops, { push: { id, node, options, state: {}, resolve } }]),
    );
  }, []);
  useEffect(() => {
    pushInstance = push;
    return () => {
      pushInstance = null;
    };
  }, [push]);
  const backHandler = useDebouncedCallback(
    () =>
      setPages((pages) => {
        if (pages[0]?.id) {
          if (pages[0].state.onBackPress && !pages[0].state.onBackPress()) {
            return pages;
          }
          setOps((ops) => (ops.some((op) => "pop" in op) ? ops : [...ops, { pop: pages[0]?.id }]));
        }
        return pages;
      }),
    200,
    { leading: true },
  );
  useEffect(() => {
    Telegram.WebApp.BackButton.onClick(backHandler);
    Telegram.WebApp.expand();
    Telegram.WebApp.disableVerticalSwipes();
    window.addEventListener(
      "scroll",
      (e) => {
        e.preventDefault();
        document.activeElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        document.documentElement.scrollTop = 0;
      },
      { passive: false },
    );
    return () => void Telegram.WebApp.BackButton.offClick(backHandler);
  }, []);
  useEffect(() => {
    if (pages.length > 0) {
      Telegram.WebApp.BackButton.show();
    } else {
      Telegram.WebApp.BackButton.hide();
    }
  }, [pages]);
  const [pushed, poped] = groupBy(ops, (op) => "push" in op);
  const renderered = pages
    .toReversed()
    .map((page, i) => (
      <PageRenderer page={page} setPages={setPages} setOps={setOps} removed={poped.some((op) => op.pop === page.id)} />
    ));
  renderered.push(...pushed.map((op) => <PageRenderer page={op.push} setOps={setOps} setPages={setPages} />));
  return (
    <StackContext.Provider value={push}>
      <slot inert={!!renderered.length}>{children}</slot>
      {renderered.map((x, idx) => (
        <slot key={idx} inert={idx !== renderered.length - 1}>
          {x}
        </slot>
      ))}
    </StackContext.Provider>
  );
}

function PageRenderer({
  page,
  setPages,
  setOps,
  removed,
}: {
  page: Page;
  setPages: Dispatch<SetStateAction<Page[]>>;
  setOps: Dispatch<SetStateAction<PageListOp[]>>;
  removed?: boolean;
}) {
  const nextState = useRef<PageState>();
  const [animated, setAnimated] = useState(false);
  const onAnimationStart = useCallback((e: AnimationEvent) => {
    if (e.currentTarget !== e.target) return;
    setAnimated(true);
  }, []);
  const onAnimationEnd = useCallback(
    (e: AnimationEvent) => {
      if (e.currentTarget !== e.target) return;
      setAnimated(false);
      if (removed) {
        setPages((pages) => pages.slice(1));
      } else {
        setPages((pages) => [nextState.current ? { ...page, state: nextState.current } : page, ...pages]);
      }
      setOps((ops) => ops.slice(1));
    },
    [page, removed],
  );
  useEffect(() => {
    if (removed) page.resolve();
  }, [removed]);
  const id = page.id;
  const pageCtx = useMemo(
    () => ({
      pop: () =>
        setPages((pages) => {
          if (pages.some((x) => x.id === id)) {
            setOps((ops) => (ops.every((op) => "pop" in op && op.pop !== id) ? [...ops, { pop: id }] : ops));
          }
          return pages;
        }),
      update: (state: PageState) => {
        setPages((pages) => pages.map((p) => (p.id === id ? { ...p, state: { ...p.state, ...state } } : p)));
        nextState.current = state;
      },
    }),
    [id],
  );
  if (page.options.type === "page")
    return (
      <>
        {removed && <div className={tw("bg-bg animate-unreveal-backdrop fixed inset-0")} />}
        <div
          inert={removed}
          className={classNames(
            tw("bg-bg fixed inset-0 isolate contain-strict"),
            removed ? tw("animate-unreveal") : tw("animate-reveal"),
          )}
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
          style={{ "--reveal-x": page.options.x + "px", "--reveal-y": page.options.y + "px" }}
        >
          <AnimatedSuspense fallback={page.options.fallback ?? <AnimatedSuspense.DefaultLoading solid />}>
            <PageContext.Provider value={pageCtx}>{page.node}</PageContext.Provider>
          </AnimatedSuspense>
          {animated && !removed && (
            <div className={tw("bg-accent-text animate-reveal-mask pointer-events-none absolute inset-0")} />
          )}
        </div>
      </>
    );
  else if (page.options.type === "bottom-sheet") {
    return (
      <div className={tw("fixed inset-0 contain-strict")}>
        <div
          className={classNames(
            tw("from-bg fixed inset-0 bg-linear-to-b to-transparent to-[24px] backdrop-blur-md"),
            removed ? tw("animate-disappear") : tw("animate-appear"),
          )}
          onClick={pageCtx.pop}
        >
          <div className={tw("bg-bg h-full w-full opacity-50")} />
        </div>
        <AnimatedSuspense fallback={page.options.fallback ?? <AnimatedSuspense.DefaultLoading />}>
          <FixedBottom
            className={classNames(
              tw("fixed right-0 bottom-0 left-0 z-1 max-h-full overflow-y-auto will-change-auto"),
              removed ? tw("animate-bottom-sheet-disappear") : tw("animate-bottom-sheet-appear"),
            )}
            onAnimationStart={onAnimationStart}
            onAnimationEnd={onAnimationEnd}
          >
            <PageContext.Provider value={pageCtx}>{page.node}</PageContext.Provider>
          </FixedBottom>
        </AnimatedSuspense>
      </div>
    );
  }
}

function FixedBottom(props: Omit<ComponentProps<"div">, "style">) {
  const height = useViewportStableHeight();
  const bottom = useViewportStableBottom();
  const visualHeight = useVisualViewportHeight();
  const visualBottom = useVisualViewportBottom();
  return (
    <div
      {...props}
      style={
        bottom != 0 && visualBottom === 0
          ? { maxHeight: visualHeight, bottom: 0, paddingBottom: bottom }
          : { maxHeight: height, bottom }
      }
    />
  );
}
