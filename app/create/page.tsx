"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, X, Zap, Target, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateBountyPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [milestones, setMilestones] = useState([
    { title: "", description: "", reward: "" },
  ]);
  const router = useRouter();

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", reward: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate bounty creation
    router.push("/bounties");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-starknet-blue via-starknet-pink to-starknet-orange opacity-10 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(225,117,177,0.1),transparent_50%)] animate-pulse"></div>

      <div className="absolute top-10 right-10 w-32 h-32 bg-starknet-orange/10 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-starknet-pink/10 rounded-full animate-bounce delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue bg-clip-text text-transparent mb-4 animate-gradient-text">
              Create a New Bounty
            </h1>
            <p className="text-muted-foreground text-lg">
              Post your project and connect with talented developers in the
              StarkNet ecosystem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-2 border-transparent bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue p-[2px] animate-gradient-border">
              <div className="bg-background rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-starknet-orange" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Provide the essential details about your bounty
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Bounty Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Build a DeFi Dashboard for StarkNet"
                      className="border-2 focus:border-starknet-orange transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project in detail. What needs to be built? What are the requirements?"
                      className="min-h-32 border-2 focus:border-starknet-pink transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select required>
                        <SelectTrigger className="border-2 focus:border-starknet-blue transition-all duration-300">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="content">
                            Content Creation
                          </SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select required>
                        <SelectTrigger className="border-2 focus:border-starknet-orange transition-all duration-300">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="solod">solod</SelectItem>
                          <SelectItem value="team">team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-r from-starknet-pink via-starknet-blue to-starknet-orange p-[2px] animate-gradient-border-reverse">
              <div className="bg-background rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-starknet-pink" />
                    Skills Required
                  </CardTitle>
                  <CardDescription>
                    Add the skills needed to complete this bounty
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g., React, Solidity)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      className="border-2 focus:border-starknet-pink transition-all duration-300"
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      size="icon"
                      className="bg-starknet-pink hover:bg-starknet-pink/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-starknet-pink/10 text-starknet-pink border border-starknet-pink/20"
                      >
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-starknet-pink hover:bg-transparent"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-r from-starknet-blue via-starknet-orange to-starknet-pink p-[2px] animate-gradient-border">
              <div className="bg-background rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-starknet-blue" />
                    Milestones & Rewards
                  </CardTitle>
                  <CardDescription>
                    Break down your bounty into milestones with specific rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-dashed border-starknet-blue/20 rounded-lg space-y-4 hover:border-starknet-blue/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Milestone {index + 1}</h4>
                        {milestones.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => {
                            const newMilestones = [...milestones];
                            newMilestones[index].title = e.target.value;
                            setMilestones(newMilestones);
                          }}
                          className="border-2 focus:border-starknet-blue transition-all duration-300"
                        />
                        <Input
                          placeholder="Reward (ETH)"
                          value={milestone.reward}
                          onChange={(e) => {
                            const newMilestones = [...milestones];
                            newMilestones[index].reward = e.target.value;
                            setMilestones(newMilestones);
                          }}
                          className="border-2 focus:border-starknet-orange transition-all duration-300"
                        />
                      </div>
                      <Textarea
                        placeholder="Describe what needs to be delivered for this milestone"
                        value={milestone.description}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].description = e.target.value;
                          setMilestones(newMilestones);
                        }}
                        className="border-2 focus:border-starknet-pink transition-all duration-300"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMilestone}
                    className="w-full border-2 border-dashed border-starknet-blue/40 hover:border-starknet-blue hover:bg-starknet-blue/5 transition-all duration-300 bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </CardContent>
              </div>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue p-[2px] animate-gradient-border-reverse">
              <div className="bg-background rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-starknet-orange" />
                    Timeline & Details
                  </CardTitle>
                  <CardDescription>
                    Set deadlines and additional requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        className="border-2 focus:border-starknet-orange transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxApplicants">Max Applicants</Label>
                      <Input
                        id="maxApplicants"
                        type="number"
                        placeholder="e.g., 5"
                        className="border-2 focus:border-starknet-pink transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">
                      Additional Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any specific requirements, deliverables, or conditions..."
                      className="border-2 focus:border-starknet-blue transition-all duration-300"
                    />
                  </div>
                </CardContent>
              </div>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                type="button"
                className="border-2 hover:border-starknet-orange transition-all duration-300 bg-transparent"
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-starknet-orange via-starknet-pink to-starknet-blue hover:from-starknet-pink hover:to-starknet-orange transition-all duration-500 transform hover:scale-105 px-8"
              >
                <Users className="mr-2 h-4 w-4" />
                Create Bounty
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
