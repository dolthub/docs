import {
    FetchEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
    createComponent,
    createIntegration,
} from '@gitbook/runtime';

interface EmbedDoltHubSQLConfiguration {}

type EmbedDoltHubSQLRuntimeEnvironment = RuntimeEnvironment<EmbedDoltHubSQLConfiguration>;
type EmbedDoltHubSQLRuntimeContext = RuntimeContext<EmbedDoltHubSQLRuntimeEnvironment>;

const handleFetchEvent: FetchEventCallback<EmbedDoltHubSQLRuntimeContext> = async (_, context) => {
    const { api } = context;
    const user = api.user.getAuthenticatedUser();

    return new Response(JSON.stringify(user));
};

/**
 * Component to render the block when embedding an DoltHub URL.
 */
type Props = {
    url: string;
};

const embedBlock = createComponent<Props>({
    componentId: 'embed',

    async action(element, action) {
        // @ts-ignore
        switch (action.action) {
            case '@link.unfurl': {
                // @ts-ignore
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

    async render(element) {
        const { url } = element.props;
        const aspectRatio = 16 / 9;
        return (
            <block>
                <webframe
                    source={{
                        url,
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
