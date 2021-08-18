<script>
  import { getContext } from "svelte";
  import { format } from "d3-format";
  import { dataset_dev } from "svelte/internal";

  const { width, height } = getContext("LayerCake");
  const offset = 15;
  let tooltipWidth, tooltipHeight;
  export let hoveredNode, hoveredLink;
  $: hovered = hoveredNode ? hoveredNode : hoveredLink;
  //   $: console.log(hovered);

  $: if (hovered) {
    // console.log(hovered.e);
    // console.log(
    //   (hovered.data.y0 + hovered.data.y1) / 2 + tooltipHeight,
    //   $height
    // );
  }

  const formatDollars = (d) => {
    return format("$0.3s")(d).replace(/G/, "B").toLowerCase();
  };
</script>

<div
  bind:clientWidth={tooltipWidth}
  bind:clientHeight={tooltipHeight}
  class={`tooltip`}
  class:active={hovered}
  style={hovered &&
    hovered.e &&
    `top: ${
      hovered.e.offsetY - tooltipHeight / 2 > $height
        ? hovered.e.offsetY - tooltipHeight
        : hovered.e.offsetY - tooltipHeight / 2
    }px; left: ${
      hovered.e.offsetX + tooltipWidth > $width
        ? hovered.e.offsetX - tooltipWidth - offset
        : hovered.e.offsetX + offset
    }px;`}
>
  {#if hovered}
    {#if hoveredNode}
      <div class="title">
        {hovered.data.id}
      </div>
      <!-- <div class="amount">
        {formatDollars(hovered.data.value)}
      </div> -->
      <div class="definition">
        {hovered.data.definition}
      </div>
    {:else}
      <div class="title">
        {formatDollars(hovered.data.value)}
      </div>
      <div class="description">
        {hovered.data.source.id} → {hovered.data.target.id}
      </div>
    {/if}
  {/if}
</div>

<style>
  .tooltip {
    font-size: 0.75rem;
    border: 1px solid var(--gray-light);
    border-radius: 3px;
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.9);
    width: 300px;
    z-index: 99;
  }
  .tooltip.active {
    visibility: visible;
  }

  .title {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
</style>
