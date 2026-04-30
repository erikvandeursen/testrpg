import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ApiEndpointProps {
  name: string;
  description: string;
  url: string;
  showCurl?: boolean;
  children: ReactNode;
}

function Clipboard({ apiPath }: { apiPath: string }) {
  const [clicked, setClicked] = useState<boolean>(false);
  const clickedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setClipboard = useCallback(async () => {
    clearTimeout(clickedTimeout.current);
    await navigator.clipboard.writeText(`curl -i -H "Accept: application/json" ${apiPath}`);
    setClicked(true);
    clickedTimeout.current = setTimeout(() => setClicked(false), 1500);
  }, [apiPath]);

  return (
    <div className="flex items-center space-x-2 transition-all">
      <button
        data-testid="copy-curl-button"
        data-clicked={clicked}
        onClick={setClipboard}
        className="data-[clicked='true']:text-blue-600"
      >
        Click here to copy <span className="font-mono font-bold text-gray-600">curl</span> command
      </button>
      {clicked && <ClipboardCheck className="h-4 w-4 text-blue-600" />}
      {!clicked && <ClipboardCopy className="h-4 w-4" />}
    </div>
  );
}

export function Introduction() {
  return (
    <div className="w-full flex flex-col items-center space-x-2 py-4">
      <div>TestRPG provides several API endpoints to use in a test suite</div>
      <Link data-testid="api-intro-link" to="/api" className="text-blue-500">
        View api endpoints &rarr;
      </Link>
    </div>
  );
}

export function ApiEndpoints() {
  return (
    <div className="flex flex-col space-y-8 py-2">
      <ApiEndpoint name="GET builds" description="Get build information" url="api/builds" showCurl>
        <h4 className="text-xl font-semibold text-blue-400">GET: /api/builds</h4>
        <p>
          Accepts an optional <span className="font-mono text-sm font-bold text-gray-600">build</span> parameter.
        </p>
        <p>
          This parameter has the following valid values:{" "}
          <span className="font-mono text-sm font-bold text-gray-600">
            thief, knight, mage, brigadier
          </span>
        </p>
      </ApiEndpoint>
      <ApiEndpoint name="POST build" description="Post build information" url="api/builds">
        <div className="flex flex-col space-y-2">
          <h4 className="text-xl font-semibold text-blue-400">POST: /api/builds</h4>
          <p>
            Post build information to the API. This endpoint will only accept requests with a JSON
            body that matches the following schema:
          </p>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(
              {
                build: {
                  name: "string",
                  strength: "number",
                  agility: "number",
                  wisdom: "number",
                  magic: "number",
                },
              },
              undefined,
              2,
            )}
          </pre>
          <p>
            Name cannot be an existing name and no skill can have a level higher than 10. 10 is also
            the maximum for the sum of all skills combined.
          </p>
        </div>
      </ApiEndpoint>
    </div>
  );
}

function ApiEndpoint(props: ApiEndpointProps) {
  const [apiPath, setApiPath] = useState<string>("");

  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    setApiPath(`${protocol}//${host}/${props.url}`);
  }, [props.url]);

  return (
    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 lg:-m-4 lg:rounded-2xl lg:p-4">
      <Card className="text-left max-w-2xl" data-testid="api-explainer">
        <CardHeader className="text-left">
          <CardTitle className="text-3xl font-bold text-blue-500">{props.name}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent>{props.children}</CardContent>
        {!!props.showCurl && (
          <CardFooter className="text-sm">
            <Clipboard apiPath={apiPath} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
