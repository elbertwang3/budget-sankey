<script>
  import { getContext, afterUpdate } from "svelte";
  import { select, selectAll } from "d3-selection";
  import * as Sankey from "d3-sankey";
  import { textwrap } from "d3-textwrap";

  const { data, width, height } = getContext("LayerCake");

  /* --------------------------------------------
   * Allow for dynamic coloring
   */
  //   export let colorLinks = (d) => "rgba(0, 0, 0, .2)";
  //   export let colorNodes = (d) => "#333";
  export let hoveredNode, hoveredLink;

  export let nodeWidth = 10;
  export let nodePadding = 10;
  export let linkSort = null;
  export let nodeId = (d) => d.id;
  const wrap = textwrap().bounds({ width: 150, height: 100 }).method("tspans");
  let label;

  const color = { revenues: "#25C2E4", funds: "#FFCA42", spending: "#F15F27" };

  $: sankey = Sankey.sankey()
    // .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeId(nodeId)
    .size([$width, $height])
    .linkSort(linkSort)
    .iterations(2000);

  $: sankeyData = sankey($data);
  // $: console.log(sankeyData.nodes);

  $: link = Sankey.sankeyLinkHorizontal();

  // afterUpdate(() => {

  // });
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
        d={link(d)}
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
      <!-- {#if d.id != "Transfer Adjustment-Source"} -->
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
            bind:this={label}
            class="node-label"
            x={d.x0 < ($width * 3) / 4 ? d.x1 + 6 : d.x0 - 6}
            y={(d.y1 + d.y0) / 2}
            style="text-anchor: {d.x0 < ($width * 3) / 4 ? 'start' : 'end'};"
          >
            {d.id}
          </text>
        {/if}
      </g>
    {/each}
  </g>
</g>

<style>
  text {
    font-family: "Amiko", sans-serif;
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
