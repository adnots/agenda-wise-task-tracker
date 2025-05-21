
import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Trash, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Task = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

const TaskItem = ({
  task,
  isEditing,
  onToggleComplete,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: TaskItemProps) => {
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    task.due_date ? parseISO(task.due_date) : undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const handleUpdate = () => {
    if (!editedTitle.trim()) return;
    
    onUpdate({
      title: editedTitle,
      description: editedDescription || null,
      due_date: editedDueDate ? editedDueDate.toISOString().split('T')[0] : null,
    });
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        task.completed
          ? "bg-muted/50 border-muted"
          : "bg-white border-border"
      } transition-all`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full font-medium"
            autoFocus
          />
          
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            className="w-full min-h-[80px]"
          />
          
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {editedDueDate ? (
                    format(editedDueDate, "dd 'de' MMMM", { locale: ptBR })
                  ) : (
                    "Data de vencimento"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedDueDate}
                  onSelect={setEditedDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {editedDueDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditedDueDate(undefined)}
                className="h-8 text-xs"
              >
                Limpar data
              </Button>
            )}
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={onCancelEdit}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>
              <Check className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={onToggleComplete}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium ${
                task.completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-1 text-sm ${
                task.completed ? "text-muted-foreground/80" : "text-muted-foreground"
              }`}>
                {task.description}
              </p>
            )}
            
            {task.due_date && (
              <div className="mt-2 text-xs text-muted-foreground flex items-center">
                <CalendarIcon className="inline mr-1 h-3 w-3" />
                {formatDueDate(task.due_date)}
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskItem;
