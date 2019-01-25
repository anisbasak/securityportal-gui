export interface DateStatement {
  trait: string;
  begin: Date;
  end: Date;
}

// Each statement in this array is AND'd together
export type DateClause = DateStatement[];

// Each clause in this array is OR'd together
export type DateSearch = DateClause[];
