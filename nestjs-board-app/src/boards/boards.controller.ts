import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { Board } from "./board.model";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatusValidationPipe } from "./pipes/board-status-validation.pipe";
import { BoardStatus } from "./board-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/user/user.model";

@Controller("boards")
@UseGuards(AuthGuard())
export class BoardsController {
  private boardLogger = new Logger("BoardsController");

  constructor(
    // 의존성 주입(타입스크립트 접근 제한자 암묵적 프로퍼티 선언 및 할당)
    private boardsService: BoardsService, //
  ) {}

  @Get()
  getAllBoards(
    @GetUser() user: User, //
  ): Promise<Board[]> {
    this.boardLogger.verbose(`User ${user.name} trying to get all boards`);
    return this.boardsService.getAllBoards();
  }

  @Get("/my")
  getMyBoards(
    @GetUser() user: User, //
  ): Promise<Board[]> {
    return this.boardsService.getMyBoards(user);
  }

  @Get("/:id")
  getBoardById(
    @Param("id", new ParseUUIDPipe({ version: "4" }))
    id: string, //
  ): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Post()
  @UsePipes(ValidationPipe) // 핸들러 레벨 파이프(빌트인파이프 - Dto 유효성 검사)
  createBoard(
    @Body() createBoardDto: CreateBoardDto, //
    @GetUser() user: User,
  ): Promise<Board> {
    this.boardLogger.verbose(
      `User ${user.name} creating a new board. Payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete("/:id")
  deleteBoard(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string, //
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch("/:id/status")
  updateBoardStatus(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string, //
    @Body("status", BoardStatusValidationPipe) status: BoardStatus, // 파라미터 레벨 파이프(커스텀 파이프 - status 유효성 검사)
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status);
  }
}
