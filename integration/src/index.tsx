import {
  FetchEventCallback,
  RuntimeContext,
  createComponent,
  createIntegration,
} from "@gitbook/runtime";

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = { embedUrl: string };
type IntegrationBlockState = { embedUrl: string; content: string };
type IntegrationAction = {};

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (
  request,
  context
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { api } = context;
  const user = api.user.getAuthenticatedUser();

  return new Response(JSON.stringify(user));
};

const embedDoltHubSQL = createComponent<
  IntegrationBlockProps,
  IntegrationBlockState,
  IntegrationAction,
  IntegrationContext
>({
  componentId: "embedDoltHubSQL",
  initialState: (props) => ({
    embedUrl: "https://dolthub.com",
    content: "",
  }),

  render: async (element, context) => {
    return (
      <block>
        <textinput state="content" />
        <divider />
        <webframe
          source={{ url: element.state.embedUrl }}
          data={{
            embedUrl: element.dynamicState("content"),
          }}
        />
      </block>
    );
  },
});

export default createIntegration({
  fetch: handleFetchEvent,
  components: [embedDoltHubSQL],
  events: {},
});
