// Función para verificar si una tarea está bloqueada por otra pendiente
export async function isTaskBlocked(taskId: number, token: string): Promise<{ blocked: boolean, blockers: any[] }> {
  const res = await fetch(`/api/tasks/taskdependencies/${taskId}/blockedBy`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al consultar dependencias');
  const data = await res.json();
  // Filtra solo las tareas bloqueadoras que NO estén en estado 'Done'
  const blockers = data.filter((dep: any) => dep.blockedByTaskId.status !== 'Done');
  return { blocked: blockers.length > 0, blockers };
}
