// Función para obtener las tareas que una tarea está bloqueando
export async function fetchTasksBlockedBy(taskId: number, token: string): Promise<any[]> {
  const res = await fetch(`/api/tasks/taskdependencies/${taskId}/isBlocking`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al consultar tareas bloqueadas');
  const data = await res.json();
  // Devuelve las tareas bloqueadas (taskId)
  return data.map((dep: any) => dep.taskId);
}
