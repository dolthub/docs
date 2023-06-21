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
    embedUrl:
      "https://dolthub-preview-1.awsdev.ld-corp.com/repositories/dolthub/SHAQ/embed/main?q=SELECT+*%0AFROM+dolt_commits%0AORDER+BY+date+DESC%0ALIMIT+5%3B",
  }),

  render: async (element) => {
    console.log(element.state.embedUrl);
    return (
      <block>
        <webframe
          source={{ url: element.props.embedUrl || element.state.embedUrl }}
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
