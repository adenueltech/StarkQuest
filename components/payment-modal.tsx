"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    title: string;
    reward: number;
    currency: string;
    client: string;
  };
  type: "apply" | "post" | "release";
}

export function PaymentModal({
  isOpen,
  onClose,
  bounty,
  type,
}: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<
    "confirm" | "processing" | "success" | "error"
  >("confirm");
  const [transactionHash, setTransactionHash] = useState("");

  const getPaymentDetails = () => {
    switch (type) {
      case "apply":
        return {
          title: "Apply for Bounty",
          description: "No payment required to apply",
          amount: 0,
          fee: 0,
          total: 0,
        };
      case "post":
        return {
          title: "Create Bounty",
          description: "Funds will be held in escrow until completion",
          amount: bounty.reward,
          fee: bounty.reward * 0.02, // 2% platform fee
          total: bounty.reward + bounty.reward * 0.02,
        };
      case "release":
        return {
          title: "Release Payment",
          description: "Release escrowed funds to contributor",
          amount: bounty.reward,
          fee: 0,
          total: bounty.reward,
        };
    }
  };

  const paymentDetails = getPaymentDetails();

  const handlePayment = async () => {
    setPaymentStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setTransactionHash("0x1234567890abcdef1234567890abcdef12345678");
        setPaymentStep("success");
      } else {
        setPaymentStep("error");
      }
    }, 3000);
  };

  const handleClose = () => {
    setPaymentStep("confirm");
    setTransactionHash("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{paymentDetails.title}</DialogTitle>
        </DialogHeader>

        {paymentStep === "confirm" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{bounty.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Client: {bounty.client}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bounty Amount</span>
                    <span>
                      {bounty.reward.toLocaleString()} {bounty.currency}
                    </span>
                  </div>
                  {paymentDetails.fee > 0 && (
                    <div className="flex justify-between">
                      <span>Platform Fee (2%)</span>
                      <span>
                        {paymentDetails.fee.toLocaleString()} {bounty.currency}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {paymentDetails.total.toLocaleString()} {bounty.currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-2 p-3 bg-starknet-blue/10 rounded-lg">
              <Shield className="h-4 w-4 text-starknet-blue mt-0.5" />
              <div className="text-sm text-starknet-blue">
                <div className="font-medium">Secure Escrow</div>
                <div>{paymentDetails.description}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-starknet-orange hover:bg-starknet-orange/90"
              >
                {type === "apply" ? "Apply" : "Confirm Payment"}
              </Button>
            </div>
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="space-y-6 text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-starknet-orange" />
            <div>
              <div className="font-medium mb-2">Processing Transaction</div>
              <div className="text-sm text-muted-foreground">
                Please confirm the transaction in your wallet and wait for
                confirmation...
              </div>
            </div>
            <Progress value={65} className="w-full" />
          </div>
        )}

        {paymentStep === "success" && (
          <div className="space-y-6 text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <div>
              <div className="font-medium mb-2">Transaction Successful!</div>
              <div className="text-sm text-muted-foreground">
                Your transaction has been confirmed on the StarkNet network.
              </div>
            </div>

            {transactionHash && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-1">Transaction Hash</div>
                <code className="text-xs break-all">{transactionHash}</code>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Close
              </Button>
              <Button className="flex-1 bg-starknet-orange hover:bg-starknet-orange/90">
                View on Block Explorer
              </Button>
            </div>
          </div>
        )}

        {paymentStep === "error" && (
          <div className="space-y-6 text-center py-8">
            <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium mb-2">Transaction Failed</div>
              <div className="text-sm text-muted-foreground">
                Something went wrong with your transaction. Please try again.
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-starknet-orange hover:bg-starknet-orange/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
