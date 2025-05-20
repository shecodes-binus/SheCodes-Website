'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseProgress {
    id: number;
    name: string;
    value: number;
    colorClass: string; // Tailwind class for the progress bar indicator
}

export const Progress: React.FC<{ courseProgressData: CourseProgress[]}> = ({courseProgressData}) => {
    return (
        <section className='flex-1 flex-col bg-white p-10 rounded-xl shadow-md'>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Progress</h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Card for Hours Spent */}
            <Card className="text-center border-none shadow-sm rounded-lg">
              <CardContent className="p-4 md:p-6">
                <p className="text-xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500 mt-1">Hours Spent</p>
              </CardContent>
            </Card>
             {/* Card for Completed */}
             <Card className="text-center border-none shadow-sm rounded-lg">
              <CardContent className="p-4 md:p-6">
                <p className="text-xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </CardContent>
            </Card>
             {/* Card for In Progress */}
             <Card className="text-center border-none shadow-sm rounded-lg">
              <CardContent className="p-4 md:p-6">
                <p className="text-xl font-bold text-gray-900">10%</p>
                <p className="text-sm text-gray-500 mt-1">In Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress Bars */}
          <div className="space-y-4">
            {courseProgressData.map((course) => (
              <Card key={course.id} className="border-none shadow-sm rounded-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-800">{course.name}</span>
                    <span className="text-sm font-medium text-gray-500">{course.value}%</span>
                  </div>
                  {/* Simple Div approach for reliable coloring */}
                   <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", course.colorClass)} style={{ width: `${course.value}%` }}></div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
    )
}
    