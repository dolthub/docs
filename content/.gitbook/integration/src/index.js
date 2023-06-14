import { createIntegration, createComponent } from "@gitbook/runtime";

export default createIntegration({
  fetch: async (element, action, context) => {},
  components: [
    createComponent({
      componentId: "embedDoltHubSQL",
      initialState: (props) => ({
        embedUrl: props.embedUrl,
      }),
      render: async (element, action, context) => {
        return (
          <block>
            <webframe
              source={{ url: element.state.embedUrl }}
              aspectRatio={16 / 9}
            />
          </block>
        );
      },
    }),
  ],
  events: {},
});
