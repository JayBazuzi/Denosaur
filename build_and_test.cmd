@%~dp0denow test --allow-all --parallel || exit /b
@%~dp0denow lint || exit /b
@%~dp0denow fmt --check || exit /b
