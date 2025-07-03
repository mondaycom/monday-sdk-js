import mondaySdk from "../types";

const monday = mondaySdk({ token: "token" });

monday.boards.createBoard({ name: "b" }).then(res => {
  const id: number = res.id;
});

monday.items.listBoardItems({ boardId: 1 }).then(res => {
  const next: string | null = res.pageInfo.cursor;
});
