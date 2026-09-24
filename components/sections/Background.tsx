/** Latar dekoratif statis (tanpa JS): grid + aurora neon. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-neon-violet/20 blur-[120px]" />
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-neon-cyan/10 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-neon-pink/10 blur-[120px]" />
    </div>
  );
}
