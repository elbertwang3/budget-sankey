<script>
  import { getContext } from "svelte";
  import * as Sankey from "d3-sankey";

  const { data, width, height } = getContext("LayerCake");
  export let hoveredNode, hoveredLink;

  export let nodeWidth = 20;
  export let nodePadding = 10;
  export let nodeId = (d) => d.id;

  const color = { revenues: "#25C2E4", funds: "#FFCA42", spending: "#F15F27" };

  $: sankey = Sankey.sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeId(nodeId)
    .size([$width, $height])
    .iterations(100);

  $: sankeyData = sankey($data);

  $: link = Sankey.sankeyLinkHorizontal();
</script>

<g class="sankey-layer">
  <g class="headers" transform={`translate(0, -15)`}>
    <text class="header start" x={0} y={0}>Revenues</text>
    <text class="header middle" x={$width / 2} y={0}>Funds</text>
    <text class="header end" x={$width} y={0}>Spending</text>
  </g>
  <g class="link-group">
    {#each sankeyData.links as d}
      <path
        class="link"
        d={link({ ...d, y1: d.y1 + 0.00001 })}
        fill="none"
        stroke={`url(#${d.source.x0 == 0 ? "rToF" : "fToS"})`}
        stroke-width={d.width}
        on:mousemove={(e) => {
          hoveredLink = { e: e, data: d };
        }}
        on:mouseout={() => (hoveredLink = null)}
        on:blur={() => (hoveredLink = null)}
      />
    {/each}
  </g>
  <g class="rect-group">
    {#each sankeyData.nodes as d, i}
      <g>
        <rect
          class="node"
          x={d.x0}
          y={d.y0}
          height={d.y1 - d.y0}
          width={d.x1 - d.x0}
          fill={color[d.category]}
          on:mousemove={(e) => {
            hoveredNode = { e: e, data: d };
          }}
          on:mouseout={() => (hoveredNode = null)}
          on:blur={() => (hoveredLink = null)}
        />
        {#if d.value > 1000000000}
          <text
            class="node-label"
            x={d.x0 < ($width * 3) / 4 ? d.x1 + 6 : d.x0 - 6}
            y={d.id == "Enterprise Funds"
              ? (d.y1 + d.y0) * 0.5
              : (d.y1 + d.y0) * 0.5}
            style="text-anchor: {d.x0 < ($width * 3) / 4 ? 'start' : 'end'};"
          >
            {#each d.id.split(" &") as t, i}
              <tspan
                x={d.x0 < ($width * 3) / 4 ? d.x1 + 6 : d.x0 - 6}
                dy={i > 0 ? "1.4em" : 0}>{`${i != 0 ? "&" : ""}${t}`}</tspan
              >
            {/each}
          </text>
        {/if}
      </g>
    {/each}
  </g>
</g>

<style>
  text {
    pointer-events: none;
  }

  .node-label {
    fill: #333;
    font-size: 12px;
  }

  .node:hover {
    stroke: #333;
    cursor: pointer;
  }

  .link {
    stroke-opacity: 0.4;
  }

  .link:hover {
    stroke-opacity: 1;
    cursor: pointer;
  }

  .header {
    font-weight: 600;
    font-size: 1.25rem;
  }

  .start {
    text-anchor: start;
  }

  .middle {
    text-anchor: middle;
  }

  .end {
    text-anchor: end;
  }
</style>
