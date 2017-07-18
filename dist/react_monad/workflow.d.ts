import { Map } from "immutable";
import { C } from '../react_monad/core';
export declare type WorkflowData<S, M> = {
    model: M;
    step: S;
};
export declare let simple_workflow: <S, M>(workflow_name: string, steps: Map<S, (_: WorkflowData<S, M>) => C<WorkflowData<S, M>>>, initial_model: C<M>, initial_step: S) => C<M>;
