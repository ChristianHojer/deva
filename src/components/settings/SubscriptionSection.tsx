import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CreditCard, ArrowUpCircle } from "lucide-react"

export const SubscriptionSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="space-y-3">
            <h4 className="font-medium">Current Plan</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">Basic features included</p>
              </div>
              <Button>
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Payment History</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">No previous payments</p>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Receipt
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Update Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}