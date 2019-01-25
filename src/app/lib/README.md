# @app/lib

Here lies all components/services/modules that can be encapsulated and reused. Each lib **must** export
an NgModule and should have no outside dependencies (npm packages are okay).

A good way to decide if a module belongs here is whether it could be a standalone npm package and be
useful to any application other than this one.
