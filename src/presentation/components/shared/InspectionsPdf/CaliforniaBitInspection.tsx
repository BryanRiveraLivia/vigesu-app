
import { LiftgateInspection } from '@/core/types/order/ITypes';
import React, { FC } from 'react'
import { IInspectionDetail } from './LiftgateInspectionCheckList';
interface Props {
  data?: LiftgateInspection;
  inspectionDetails?: IInspectionDetail[];
  isEditable?: boolean;
}
const CaliforniaBitInspection: FC<Props> = ({
  data,
  inspectionDetails = [],
  isEditable,
}) => {
  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[20px] border-2 mt-5 print-no-flex print-no-gap">
      <h1
        className="font-bold text-4xl  text-center"
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        California Only 90 Day BIT Inspection
      </h1>
      <div className="flex flex-col mt-5 p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus iste distinctio animi recusandae, consectetur facere fuga, odio nisi culpa saepe laboriosam officia? Consectetur id, error odio doloremque libero unde obcaecati.
      </div>
    </div>
  )
}

export default CaliforniaBitInspection