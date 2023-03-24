export function Status({ color }: { color: string }) {
  return (
    <span
      className="rounded-[3px] h-2 w-3 relative"
      style={{ backgroundColor: color }}
    >
      <span
        className=" blur-[4px] rounded-[3px] h-2 w-3 absolute
        top-0 left-0 right-0 bottom-0"
        style={{ backgroundColor: color }}
      ></span>
    </span>
  );
}
