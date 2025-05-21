
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import FilterBar from "@/components/FilterBar";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Task = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type TimeFilter = "day" | "week" | "month" | "all";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [viewMode, setViewMode] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    fetchTasks();
  }, [timeFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from("tasks").select("*").order("due_date", { ascending: true });
      
      // Aplicar filtro de tempo
      if (timeFilter !== "all") {
        const today = new Date();
        let endDate = new Date();

        if (timeFilter === "day") {
          // Hoje
          query = query.gte("due_date", today.toISOString().split('T')[0]);
          endDate.setDate(today.getDate() + 1);
          query = query.lt("due_date", endDate.toISOString().split('T')[0]);
        } else if (timeFilter === "week") {
          // Esta semana
          query = query.gte("due_date", today.toISOString().split('T')[0]);
          endDate.setDate(today.getDate() + 7);
          query = query.lt("due_date", endDate.toISOString().split('T')[0]);
        } else if (timeFilter === "month") {
          // Este mês
          query = query.gte("due_date", today.toISOString().split('T')[0]);
          endDate.setMonth(today.getMonth() + 1);
          query = query.lt("due_date", endDate.toISOString().split('T')[0]);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        setTasks(data as Task[]);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: Omit<Task, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase.from("tasks").insert(newTask).select();

      if (error) {
        throw error;
      }

      if (data) {
        setTasks((prevTasks) => [...prevTasks, data[0] as Task]);
        toast.success("Tarefa criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      toast.error("Erro ao adicionar tarefa");
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);

      if (error) {
        throw error;
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
      
      toast.success("Tarefa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Erro ao atualizar tarefa");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Tarefa removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa");
    }
  };

  const toggleTaskCompletion = async (id: number, currentStatus: boolean) => {
    await updateTask(id, { completed: !currentStatus });
  };

  // Filtrar tarefas com base no modo de visualização
  const filteredTasks = tasks.filter((task) => {
    if (viewMode === "pending") return !task.completed;
    if (viewMode === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">TaskMaster</h1>
      
      <div className="mb-6">
        <TaskForm onAddTask={addTask} />
      </div>
      
      <div className="mb-6">
        <FilterBar 
          onTimeFilterChange={setTimeFilter} 
          selectedTimeFilter={timeFilter}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setViewMode(value as "all" | "pending" | "completed")}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
