import React, { useState, useEffect } from "react";

interface TaskInputProps {
  onAdd: (task: string) => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Task text:", text);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
