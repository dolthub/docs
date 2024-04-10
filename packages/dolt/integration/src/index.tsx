import {
  FetchEventCallback,
  RuntimeContext,
  RuntimeEnvironment,
  createComponent,
  createIntegration,
} from "@gitbook/runtime";

interface EmbedDoltHubSQLConfiguration {}

type EmbedDoltHubSQLRuntimeEnvironment =
  RuntimeEnvironment<EmbedDoltHubSQLConfiguration>;
type EmbedDoltHubSQLRuntimeContext =
  RuntimeContext<EmbedDoltHubSQLRuntimeEnvironment>;

const handleFetchEvent: FetchEventCallback<
  EmbedDoltHubSQLRuntimeContext
> = async (request, context) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { api } = context;
  const user = api.user.getAuthenticatedUser();

  return new Response(JSON.stringify(user));
};

/**
 * Component to render the block when embeding an DoltHub URL.
 */
const embedBlock = createComponent<{
  url?: string;
}>({
  componentId: "embed",

  async action(element, action) {
    switch (action.action) {
      case "@link.unfurl": {
        const { url } = action;

        return {
          props: {
            url,
          },
        };
      }
    }

    return element;
  },

  async render(element, context) {
    const { url } = element.props;
    const aspectRatio = 16 / 9;
    return (
      <block>
        <webframe
          source={{
            url: url,
          }}
          aspectRatio={aspectRatio}
        />
      </block>
    );
  },
});

export default createIntegration<EmbedDoltHubSQLRuntimeContext>({
  fetch: handleFetchEvent,
  components: [embedBlock],
});
