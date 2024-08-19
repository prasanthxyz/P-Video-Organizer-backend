import { sync as isCommandExisting } from "command-exists";
import * as fs from "fs";
import { Context } from "koa";
import send from "koa-send";
import * as path from "path";

export function getExecutablesStatus(ctx: Context): void {
  ctx.body = [isCommandExisting("ffmpeg")];
}

export async function getStaticFile(ctx: Context): Promise<void> {
  const filePath = ctx.query.filePath as string;

  if (!filePath || !path.isAbsolute(filePath)) {
    ctx.status = 400;
    ctx.body = "Invalid file path";
    return;
  }

  const exists = await fileExists(filePath);
  if (!exists) {
    ctx.status = 404;
    ctx.body = "File not found";
    return;
  }

  await send(ctx, filePath, { root: "/" });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
