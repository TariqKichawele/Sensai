'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not signed in");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    });
    if (!user) throw new Error("User not found");

    try {
        const result = await db.$transaction(async (tx) => {
            let industryInsight = await tx.industryInsight.findUnique({
                where: {
                    industry: data.industry
                }
            });

            if (!industryInsight) {
                industryInsight = await tx.industryInsight.create({
                    data: {
                        industry: data.industry,
                        salaryRanges: [],
                        growthRate: 0,
                        demandLevel: "Medium",
                        topSkills: [],
                        marketOutlook: "Neutral",
                        keyTrends: [],
                        recommendedSkills: [],
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                    }
                })
            }

            const updatedUser = await tx.user.update({
                where: {
                    id: user.id
                },
                data: { 
                    industry: data.industry,
                    experience: data.experience,
                    skills: data.skills,
                    bio: data.bio,
                }
            });

            return { updatedUser, industryInsight };
        }, {
            timeout: 10000
        });

        revalidatePath("/");

        return result.user;
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile");
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not signed in");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    });
    if (!user) throw new Error("User not found");
    
    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                industry: true
            }
        });
        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.error("Error getting user onboarding status:", error.message);
        throw new Error("Failed to get user onboarding status");
    }
}