@call %~dp0denow test --allow-all --parallel || exit /b
@call %~dp0denow lint || exit /b
@call %~dp0denow fmt --check || exit /b
