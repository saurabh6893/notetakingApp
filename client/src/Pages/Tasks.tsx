import TaskInput from "../Components/TaskInput";
import { useTasks } from "../context/useTasks";

const Tasks: React.FC = () => {
  const { tasks } = useTasks();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <TaskInput />
      <ul className="mt-4 space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
