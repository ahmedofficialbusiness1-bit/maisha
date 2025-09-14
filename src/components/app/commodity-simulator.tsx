'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { runCommoditySimulation, type FormState } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu, Bot, DollarSign } from 'lucide-react';

const initialState: FormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Cpu className="mr-2 h-4 w-4 animate-spin" />
          Simulating...
        </>
      ) : (
        <>
          <Cpu className="mr-2 h-4 w-4" />
          Run Simulation
        </>
      )}
    </Button>
  );
}

export function CommoditySimulator() {
  const [formState, formAction] = useFormState(
    runCommoditySimulation,
    initialState
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
    }
  }, [formState.success]);


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form ref={formRef} action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>Commodity Price Simulator</CardTitle>
              <CardDescription>
                Use AI to simulate prices based on economic factors.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="commodity">Commodity</Label>
                <Select name="commodity" required>
                  <SelectTrigger id="commodity">
                    <SelectValue placeholder="Select a commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corn">Corn</SelectItem>
                    <SelectItem value="Sunflower Seeds">Sunflower Seeds</SelectItem>
                    <SelectItem value="Eggs">Eggs</SelectItem>
                    <SelectItem value="Crude Oil">Crude Oil</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supply">Supply</Label>
                  <Input id="supply" name="supply" type="number" placeholder="e.g., 1000000" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demand">Demand</Label>
                  <Input id="demand" name="demand" type="number" placeholder="e.g., 800000" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="worldEvents">World Events</Label>
                <Textarea
                  id="worldEvents"
                  name="worldEvents"
                  placeholder="Describe any relevant world events, e.g., 'Drought in a major producing region, new trade agreement signed.'"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminAdjustment">Admin Adjustment ($)</Label>
                <Input
                  id="adminAdjustment"
                  name="adminAdjustment"
                  type="number"
                  placeholder="Optional, e.g., -50 or 100"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!formState.success && formState.message && (
                <p className="text-sm text-destructive">{formState.message}</p>
              )}
               <div className="flex-grow"></div>
              <SubmitButton />
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Simulation Result</CardTitle>
            <CardDescription>
              The AI's analysis will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formState.success && formState.data ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-accent/20 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Simulated Price</p>
                    <p className="text-3xl font-bold">
                      ${formState.data.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Bot className="h-5 w-5 text-primary" />
                    AI Economist's Reasoning
                  </h3>
                  <div className="prose prose-sm max-w-none rounded-md border bg-card p-4 text-card-foreground">
                     <p>{formState.data.reasoning}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <Cpu className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-center text-muted-foreground">
                  Waiting for simulation parameters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
