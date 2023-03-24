import { Divider } from './Divider';

export function Panel({
  header,
  body,
  className,
}: {
  header: React.ReactNode;
  body: React.ReactNode;
  className?: string;
}) {
  return (
    // background: #14121A;
    // border-radius: 6px;
    <div
      className={`w-[346px] flex flex-col
      bg-[#14121A] rounded-[6px]
      border border-[#25242B] ${className}
    `}
    >
      <div
        className="text-white pt-[26px] px-[24px] pb-[10px]"
        style={{
          background:
            'linear-gradient(90.01deg, #1B1824 0.01%, rgba(27, 24, 36, 0.74) 99.99%)',
        }}
      >
        {header}
      </div>

      <Divider />

      <div
        className="relative bg-gradient-to-r from-[#1B1824] to-[rgba(27,24,36,0.74)] max-h-full overflow-hidden
        text-[#949398] px-[24px] text-[14px] leading-[20px] font-normal flex-1"
      >
        {body}
      </div>
    </div>
  );
}
