-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resumeLink" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "themeColor" TEXT NOT NULL DEFAULT 'sky',
    "avatarUrl" TEXT NOT NULL,
    "contact" JSONB NOT NULL DEFAULT '{"X": "", "GitHub": "", "Youtube": "", "LinkedIn": "", "dribbble": ""}',
    "workExperience" JSONB NOT NULL DEFAULT '[]',
    "education" JSONB NOT NULL DEFAULT '[]',
    "hackathonDescription" TEXT NOT NULL,
    "projects" JSONB NOT NULL DEFAULT '[]',
    "projectDescription" TEXT NOT NULL,
    "hackathons" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
