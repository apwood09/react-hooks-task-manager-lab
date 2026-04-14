import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../../components/App";
import { TaskProvider } from "../../context/TaskContext";

describe("Task Manager App", () => {
  test("renders initial tasks from the backend", async () => {
    global.setFetchResponse(global.baseTasks)
    let { getByText } = render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );
    
    await waitFor(() => {
      expect(getByText("Buy groceries")).toBeInTheDocument();
      expect(getByText("Finish React project")).toBeInTheDocument();
    });
  });

  test("adds a new task when the form is submitted", async () => {
  global.setFetchResponse(global.baseTasks)
  render(
    <TaskProvider>
      <App />
    </TaskProvider>
  );

  const input = await screen.findByPlaceholderText("Add a new task...");
  const button = await screen.findByText("Add Task");

  fireEvent.change(input, { target: { value: "Walk the dog" } });
  
  global.setFetchResponse({ id: 3, title: "Walk the dog", completed: false })
  fireEvent.click(button);

  expect(await screen.findByText("Walk the dog")).toBeInTheDocument();
});

  test("filters tasks based on search input", async () => {
    global.setFetchResponse(global.baseTasks)
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const searchInput = screen.getByPlaceholderText("Search tasks...");

    fireEvent.change(searchInput, { target: { value: "groceries" } });

    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.queryByText("Finish React project")).not.toBeInTheDocument();
    });
  });

  test("toggles task completion state", async () => {
    global.setFetchResponse(global.baseTasks)
    let { getByText, findAllByTestId } = render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );
    const button =  await findAllByTestId("1")
    global.setFetchResponse({ id: 1, title: "Buy groceries", completed: true })
    
    
    await waitFor(() => {
        fireEvent.click(button[0]);
        expect(getByText("Undo")).toBeInTheDocument();
    });
  });
});
