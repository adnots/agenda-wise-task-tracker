
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";

type Task = {
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
};

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      title,
      description: description || null,
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
      completed: false,
    };
    
    onAddTask(newTask);
    
    // Limpar o formulário
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setIsExpanded(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Nova Tarefa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="O que você precisa fazer?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isExpanded && e.target.value) setIsExpanded(true);
              }}
              className="flex-1"
              autoFocus
            />
            <Button type="submit">Adicionar</Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-4 animate-fade-in">
              <Textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
              
              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "dd 'de' MMMM", { locale: ptBR })
                      ) : (
                        "Data de vencimento"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {dueDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDueDate(undefined)}
                    className="h-8 text-xs"
                  >
                    Limpar data
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
