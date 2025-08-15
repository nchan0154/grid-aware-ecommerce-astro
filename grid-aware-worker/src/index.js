import gridAwareAuto from '@greenweb/gaw-plugin-cloudflare-workers';

const on = new HTMLRewriter()
.on('body', {
	element: (element) => {
		element.setAttribute('data-gaw-mode', 'on');
	},
}).on('script', {
	element: (element) => {
		if (element.getAttribute('src')?.includes('GA-')) {
			element.remove()
		}
	},
})


export default {
	async fetch(request, env, ctx) {
		return gridAwareAuto(request, env, ctx, {
			gawDataApiKey: env.EMAPS_API_KEY,
			debug: 'headers',
			contentType: ['text/html', 'text/plain'],
			devMode: false,
			infoBar: {
        target: "#gaw-info-bar .container",
        learnMoreLink:
          "https://www.thegreenwebfoundation.org/tools/grid-aware-websites/",
        version: "latest",
        popoverText:
          "This website adapts based on your local electricity grid's carbon intensity",
      },
			kvCacheData: true,
      htmlChanges: {
				low: new HTMLRewriter()
					.on('body', {
						element: (element) => {
							element.setAttribute('data-gaw-mode', 'off');
						},
					}),
				moderate: on,
				high: on,
				}
		});
	},
};
