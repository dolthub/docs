import {
  FetchEventCallback,
  RuntimeContext,
  createComponent,
  createIntegration,
} from "@gitbook/runtime";

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = { embedUrl: string };
type IntegrationBlockState = { embedUrl: string };
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
  }),

  render: async (element) => {
    console.log(element.state.embedUrl);
    return (
      <block>
        <webframe
          source={{ url: element.props.embedUrl }}
          aspectRatio={16 / 9}
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
