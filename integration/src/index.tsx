import {
  RuntimeContext,
  RuntimeEnvironment,
  createComponent,
  createIntegration,
} from "@gitbook/runtime";

interface DoltHubSQLInstallationConfiguration {}

type DoltHubSQLRuntimeEnvironment =
  RuntimeEnvironment<DoltHubSQLInstallationConfiguration>;
type DoltHubSQLRuntimeContext = RuntimeContext<DoltHubSQLRuntimeEnvironment>;

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

  render: async (element) => {
    const url = new URL(
      "https://dolthub-preview-1.awsdev.ld-corp.com/repositories/dolthub/SHAQ/embed/main?q=SELECT+*FROM+dolt_commitsORDER+BY+date+DESCLIMIT+5;"
    );
    url.searchParams.set("embed_host", "gitbook.com");
    url.searchParams.set("url", element.props.url);
    return (
      <block>
        <webframe source={{ url: url.toString() }} aspectRatio={16 / 9} />
      </block>
    );
  },
});

export default createIntegration<DoltHubSQLRuntimeContext>({
  components: [embedBlock],
});
