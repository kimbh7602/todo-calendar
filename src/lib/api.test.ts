import { describe, it, expect, beforeEach } from "vitest";
import {
  api,
  type DataProvider,
  createLocalProvider,
} from "./api";

describe("api — data access layer", () => {
  let provider: DataProvider;

  beforeEach(() => {
    provider = createLocalProvider();
    api.setProvider(provider);
  });

  describe("categories", () => {
    it("기본 카테고리 3개를 반환한다", async () => {
      const categories = await api.fetchCategories();
      expect(categories).toHaveLength(3);
      expect(categories[0].name).toBe("개인");
      expect(categories[1].name).toBe("업무");
      expect(categories[2].name).toBe("운동");
    });

    it("카테고리를 추가할 수 있다", async () => {
      await api.createCategory({ name: "학습", color: "#5CC8FF", sortOrder: 3 });
      const categories = await api.fetchCategories();
      expect(categories).toHaveLength(4);
      expect(categories[3].name).toBe("학습");
    });
  });

  describe("todos", () => {
    it("투두를 생성하고 조회할 수 있다", async () => {
      const categories = await api.fetchCategories();
      const todo = await api.createTodo({
        categoryId: categories[0].id,
        title: "테스트 할 일",
        startDate: "2026-04-07",
        endDate: null,
        isRoutine: false,
        routineDays: null,
        routineEndDate: null,
        sortOrder: 0,
      });

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe("테스트 할 일");

      const todos = await api.fetchTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo.id);
    });

    it("투두를 수정할 수 있다", async () => {
      const todo = await api.createTodo({
        categoryId: null,
        title: "원래 제목",
        startDate: "2026-04-07",
        endDate: null,
        isRoutine: false,
        routineDays: null,
        routineEndDate: null,
        sortOrder: 0,
      });

      const updated = await api.updateTodo(todo.id, { title: "수정된 제목" });
      expect(updated.title).toBe("수정된 제목");

      const todos = await api.fetchTodos();
      expect(todos[0].title).toBe("수정된 제목");
    });

    it("투두를 삭제하면 관련 완료 기록도 삭제된다", async () => {
      const todo = await api.createTodo({
        categoryId: null,
        title: "삭제할 투두",
        startDate: "2026-04-07",
        endDate: null,
        isRoutine: false,
        routineDays: null,
        routineEndDate: null,
        sortOrder: 0,
      });

      await api.toggleCompletion(todo.id, "2026-04-07");
      let completions = await api.fetchCompletions();
      expect(completions).toHaveLength(1);

      await api.deleteTodo(todo.id);
      const todos = await api.fetchTodos();
      expect(todos).toHaveLength(0);

      completions = await api.fetchCompletions();
      expect(completions).toHaveLength(0);
    });
  });

  describe("completions", () => {
    it("완료를 토글하면 생성/삭제된다", async () => {
      const todo = await api.createTodo({
        categoryId: null,
        title: "토글 테스트",
        startDate: "2026-04-07",
        endDate: null,
        isRoutine: false,
        routineDays: null,
        routineEndDate: null,
        sortOrder: 0,
      });

      // 첫 토글: 생성
      await api.toggleCompletion(todo.id, "2026-04-07");
      let completions = await api.fetchCompletions();
      expect(completions).toHaveLength(1);
      expect(completions[0].todoId).toBe(todo.id);
      expect(completions[0].completedDate).toBe("2026-04-07");

      // 두 번째 토글: 삭제
      await api.toggleCompletion(todo.id, "2026-04-07");
      completions = await api.fetchCompletions();
      expect(completions).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("존재하지 않는 투두 수정 시 에러를 던진다", async () => {
      await expect(
        api.updateTodo("nonexistent-id", { title: "nope" })
      ).rejects.toThrow();
    });

    it("존재하지 않는 투두 삭제 시 에러를 던진다", async () => {
      await expect(api.deleteTodo("nonexistent-id")).rejects.toThrow();
    });
  });
});
