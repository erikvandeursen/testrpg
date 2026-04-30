import { type ChangeEvent, type ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/components/rpg/store";

interface TaskProps {
  title: string;
  description: string;
  children: ReactNode;
  "data-testid"?: string;
}

function Task({ title, description, children, ...props }: TaskProps) {
  return (
    <section className="space-y-2 min-h-[100px]" {...props}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-between">{children}</div>
    </section>
  );
}

function TaskLabel({ value, show, task }: { value: string; show: boolean; task: string }) {
  if (!show) return null;
  return (
    <span data-task={task} className="text-sm md:text-md lg:text-lg font-bold text-blue-500">
      {value}
    </span>
  );
}

function Clicker() {
  const [clicks, setClicks] = useState<number>(0);
  const increaseLevel = useStore((state) => state.increaseLevel);
  const maxClicks = 5;
  const disabled = clicks === maxClicks;
  const onClick = () => {
    setClicks((prev) => prev + 1);
    if (clicks === 4) increaseLevel();
  };

  return (
    <Task data-testid="adventure-clicker" title="Click it!" description="Click the button to level up">
      <Button data-testid="clicker-button" disabled={disabled} onClick={onClick}>
        Click me {maxClicks - clicks} times
      </Button>
      <TaskLabel task="clicker" value="Great job! You levelled up" show={clicks === 5} />
    </Task>
  );
}

function Uploader() {
  const [value, setValue] = useState<string>("");
  const increaseLevel = useStore((state) => state.increaseLevel);
  const uploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    increaseLevel();
  };

  return (
    <Task data-testid="adventure-uploader" title="Upload it!" description="Upload any file to level up">
      <Input
        data-testid="uploader-input"
        disabled={!!value}
        type="file"
        className="w-1/2"
        value={value}
        onChange={uploadHandler}
      />
      <TaskLabel task="uploader" value="File selected, level up!" show={!!value} />
    </Task>
  );
}

function Typer() {
  const [value, setValue] = useState<string>("");
  const increaseLevel = useStore((state) => state.increaseLevel);
  const activateBerserk = useStore((state) => state.activateBerserk);
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (event.target.value === "Lorem Ipsum") {
      increaseLevel();
      return;
    }

    if (event.target.value.toLowerCase() === "all your base are belong to us") {
      activateBerserk();
    }
  };

  return (
    <Task data-testid="adventure-typer" title="Type it!" description="Type Lorem Ipsum to level up">
      <Input
        data-testid="typer-input"
        disabled={value === "Lorem Ipsum"}
        className="w-1/2"
        value={value}
        onChange={changeHandler}
      />
      <TaskLabel task="typer" value="Dolar sit amet!" show={value === "Lorem Ipsum"} />
    </Task>
  );
}

function SliderTask() {
  const [value, setValue] = useState<number[]>([0]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const increaseLevel = useStore((state) => state.increaseLevel);

  const onValueChange = (next: number[]) => {
    setValue(next);
    if (next[0] === 100) {
      setDisabled(true);
      increaseLevel();
    }
  };

  return (
    <Task
      data-testid="adventure-slider"
      title="Slide it!"
      description="Slide the slider all the way to the right"
    >
      <Slider
        data-testid="slider-input"
        className="w-1/2"
        disabled={disabled}
        onValueChange={onValueChange}
        defaultValue={[0]}
        max={100}
        step={1}
      />
      <TaskLabel task="slider" value="Slid to the next level!" show={value[0] === 100} />
    </Task>
  );
}

export function AdventureContainer(props: { reset: () => void }) {
  const level = useStore((state) => state.level);

  return (
    <Card data-testid="adventure-container">
      <CardHeader>
        <CardTitle>Adventure time</CardTitle>
        <CardDescription>Complete the tasks below and level up your character</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Clicker />
        <Uploader />
        <Typer />
        <SliderTask />
      </CardContent>
      {level === 5 && (
        <CardFooter className="flex flex-col space-y-2">
          <span
            data-testid="max-level-message"
            className="text-lg text-amber-500 font-bold animate-pulse"
          >
            You&apos;ve reached the highest level!{" "}
          </span>
          <Button data-testid="play-again-button" onClick={props.reset}>
            Play again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
