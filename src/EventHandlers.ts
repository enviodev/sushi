/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  UniswapV3FactoryContract,
  UniswapV3PoolContract,
} from "../generated/src/Handlers.gen";

import {
  UniswapV3Factory,
  UniswapV3Pool,
  EventsSummaryEntity,
} from "../generated/src/Types.gen";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  uniswapV3Factory_PoolCreatedCount: BigInt(0),
  uniswapV3Pool_SwapCount: BigInt(0),
};

UniswapV3FactoryContract.PoolCreated.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

UniswapV3FactoryContract.PoolCreated.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    uniswapV3Factory_PoolCreatedCount:
      currentSummaryEntity.uniswapV3Factory_PoolCreatedCount + BigInt(1),
  };

  const uniswapV3Factory_PoolCreatedEntity: UniswapV3Factory.PoolCreatedEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      token0: event.params.token0,
      token1: event.params.token1,
      fee: event.params.fee,
      tickSpacing: event.params.tickSpacing,
      pool: event.params.pool,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    };

  context.EventsSummary.set(nextSummaryEntity);
  context.UniswapV3Factory_PoolCreated.set(uniswapV3Factory_PoolCreatedEntity);
});
UniswapV3PoolContract.Swap.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

UniswapV3PoolContract.Swap.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    uniswapV3Pool_SwapCount:
      currentSummaryEntity.uniswapV3Pool_SwapCount + BigInt(1),
  };

  const uniswapV3Pool_SwapEntity: UniswapV3Pool.SwapEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    sender: event.params.sender,
    recipient: event.params.recipient,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
    sqrtPriceX96: event.params.sqrtPriceX96,
    liquidity: event.params.liquidity,
    tick: event.params.tick,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.UniswapV3Pool_Swap.set(uniswapV3Pool_SwapEntity);
});
