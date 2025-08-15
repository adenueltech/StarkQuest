import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react"

interface Transaction {
  id: string
  type: "sent" | "received" | "pending"
  amount: string
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  hash: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "received",
    amount: "2.5 ETH",
    description: "Bounty payment for DeFi Dashboard UI",
    date: "2024-01-15",
    status: "completed",
    hash: "0x1234...5678",
  },
  {
    id: "2",
    type: "sent",
    amount: "0.1 ETH",
    description: "Application fee for Smart Contract Audit",
    date: "2024-01-14",
    status: "completed",
    hash: "0x2345...6789",
  },
  {
    id: "3",
    type: "pending",
    amount: "1.8 ETH",
    description: "Bounty payment for Mobile App Design",
    date: "2024-01-13",
    status: "pending",
    hash: "0x3456...7890",
  },
]

export function TransactionHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sent":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "received":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-starknet-orange">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTypeIcon(transaction.type)}
                <div>
                  <p className="font-medium text-starknet-orange">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                  <p className="text-xs text-gray-400 font-mono">{transaction.hash}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === "received" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "received" ? "+" : "-"}
                    {transaction.amount}
                  </p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(transaction.status)}
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
