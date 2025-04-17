import { ClipboardList, PlusCircle } from 'lucide-react';

export default function OfferFormStart({
  setStepNo,
}: {
  setStepNo: (value: number) => void;
}) {
  return (
    <div className="flex flex-col items-start justify-center gap-2 self-stretch px-6 pb-6">
      <div
        onClick={() => {
          setStepNo(0);
        }}
        className="inline-flex cursor-pointer items-start justify-start gap-2 self-stretch rounded-lg p-6 outline outline-1 outline-offset-[-1px] outline-slate-500"
      >
        <div className="">
          <PlusCircle className="h-6 w-6 stroke-zinc-950" />
        </div>
        <div className="flex flex-1 items-center justify-start gap-2 self-stretch">
          <div className="flex-1 justify-start text-sm leading-tight font-medium">
            Start from scratch
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setStepNo(-1);
        }}
        className="inline-flex cursor-pointer items-start justify-start gap-2 self-stretch rounded-lg p-6 outline outline-1 outline-offset-[-1px] outline-slate-500"
      >
        <div className="">
          <ClipboardList className="h-6 w-6 stroke-zinc-950" />
        </div>
        <div className="flex flex-1 items-center justify-start gap-2 self-stretch">
          <div className="flex-1 justify-start text-sm leading-tight font-medium">
            Choose a template
          </div>
        </div>
      </div>
    </div>
  );
}
