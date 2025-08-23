"use client";
import BackButton from "@/components/back-button";

import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useState } from "react";

export default function PostBountyPage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bounties
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post a New Bounty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Bounty Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Build a DeFi Dashboard for StarkNet"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="development">
                              Development
                            </SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="content">Content</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="difficulty">Formation</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="Solo">Solo</SelectItem>
                            <SelectItem value="Solo">Solo</SelectItem>
                            <SelectItem value="Team">Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description of the bounty, including requirements, deliverables, and evaluation criteria..."
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </div>

                  {/* Reward & Timeline */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reward">Reward Amount</Label>
                        <Input
                          id="reward"
                          type="number"
                          placeholder="1000"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="STRK" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strk">STRK</SelectItem>
                            <SelectItem value="eth">ETH</SelectItem>
                            <SelectItem value="usdc">USDC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input id="deadline" type="date" className="mt-1" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Tags</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag (e.g., React, TypeScript)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          size="icon"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="max-applicants">
                        Maximum Applicants (Optional)
                      </Label>
                      <Input
                        id="max-applicants"
                        type="number"
                        placeholder="Leave empty for unlimited"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="requirements">
                        Special Requirements (Optional)
                      </Label>
                      <Textarea
                        id="requirements"
                        placeholder="Any specific requirements, qualifications, or portfolio examples needed..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">
                      Your Bounty Title
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Category</Badge>
                      <Badge variant="secondary">Difficulty</Badge>
                    </div>
                    <div className="text-2xl font-bold text-starknet-blue">
                      0 STRK
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Deadline: Not set
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posting Cost */}
              <Card>
                <CardHeader>
                  <CardTitle>Posting Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Platform Fee (2%)</span>
                      <span>0 STRK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escrow Deposit</span>
                      <span>0 STRK</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Required</span>
                        <span>0 STRK</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-starknet-orange hover:bg-starknet-orange/90"
                  size="lg"
                >
                  Create Bounty
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save as Draft
                </Button>
              </div>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Be specific about requirements and deliverables</p>
                  <p>• Set realistic deadlines and rewards</p>
                  <p>• Include examples or references when possible</p>
                  <p>• Respond promptly to applicant questions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
