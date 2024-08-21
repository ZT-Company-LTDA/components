import React from "react";
import { Card, Skeleton, SkeletonProps } from "@nextui-org/react";

interface CustomSkeletonProps extends SkeletonProps {
  numberSkeletons: number;
}

export default function CustomSkeleton({ numberSkeletons, ...props }: CustomSkeletonProps) {
  return (
    <div className="md:flex gap-2 md:flex-wrap md:overflow-hidden">
      {Array.from({ length: numberSkeletons }).map((_, index) => (
        <Card key={index} className="w-[200px] space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg" {...props}>
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg" {...props}>
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg" {...props}>
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg" {...props}>
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      ))}
    </div>
  );
}
