
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TaskItem from "./TaskItem";
import { ScrollArea } from "@/components/ui/scroll-area";

type Task = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (id: number, currentStatus: boolean) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList = ({ 
  tasks, 
  loading, 
  onToggleComplete, 
  onUpdateTask, 
  onDeleteTask 
}: TaskListProps) => {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-2">Nenhuma tarefa encontrada</p>
          <p className="text-sm text-muted-foreground">
            Adicione uma nova tarefa usando o formulário acima
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 p-4">
        <ScrollArea className="h-[50vh]">
          <div className="space-y-4 pr-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingTaskId === task.id}
                onToggleComplete={() => onToggleComplete(task.id, task.completed)}
                onEdit={() => setEditingTaskId(task.id)}
                onCancelEdit={() => setEditingTaskId(null)}
                onUpdate={(updates) => {
                  onUpdateTask(task.id, updates);
                  setEditingTaskId(null);
                }}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TaskList;
