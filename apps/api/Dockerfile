FROM node:22-alpine

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @grocersync/api prisma:generate
RUN pnpm --filter @grocersync/api build

EXPOSE 3000

CMD ["sh", "-c", "pnpm --dir apps/api exec prisma db push --schema prisma/schema.prisma && node apps/api/dist/index.js"]
