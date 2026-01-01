"""Output formatting for the CLI"""
from typing import List
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from src.models.task import Task

try:
    from rich.console import Console
    from rich.table import Table
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False


class Display:
    """
    Display formatter for CLI output with optional rich formatting.
    """
    
    def __init__(self):
        """Initialize display with rich console if available."""
        self.console = Console() if RICH_AVAILABLE else None
    
    def format_task_list(self, tasks: List[Task]) -> None:
        """
        Display tasks in table format.
        
        Args:
            tasks: List of tasks to display
        """
        if not tasks:
            self.show_empty_list()
            return
        
        if RICH_AVAILABLE:
            self._format_task_list_rich(tasks)
        else:
            self._format_task_list_plain(tasks)
    
    def _format_task_list_rich(self, tasks: List[Task]) -> None:
        """Format task list using rich library."""
        table = Table(title=f"All Tasks ({len(tasks)} total)", title_style="bright_blue")
        
        table.add_column("ID", style="magenta", no_wrap=True)
        table.add_column("Title", style="bright_white")
        table.add_column("Description", style="default")
        table.add_column("Status", justify="center")
        table.add_column("Created", style="default")
        
        for task in tasks:
            status = self.format_status(task.completed)
            table.add_row(
                task.short_id(),
                task.title,
                task.description[:50] + "..." if len(task.description) > 50 else task.description,
                status,
                task.created_at.split('T')[0] + " " + task.created_at.split('T')[1][:8]
            )
        
        self.console.print(table)
    
    def _format_task_list_plain(self, tasks: List[Task]) -> None:
        """Format task list using plain text."""
        print(f"\nTasks ({len(tasks)} total):")
        print("-" * 100)
        print(f"{'ID':<10} {'Title':<25} {'Description':<30} {'Status':<8} {'Created':<20}")
        print("-" * 100)
        
        for task in tasks:
            status = self.format_status(task.completed)
            desc_short = task.description[:27] + "..." if len(task.description) > 30 else task.description
            created = task.created_at.split('T')[0] + " " + task.created_at.split('T')[1][:8]
            print(f"{task.short_id():<10} {task.title:<25} {desc_short:<30} {status:<8} {created:<20}")
        
        print("-" * 100)
    
    def format_status(self, completed: bool) -> str:
        """
        Format completion status with indicators.
        
        Args:
            completed: Task completion status
            
        Returns:
            Status indicator (✓ or ✗)
        """
        if RICH_AVAILABLE:
            return "[bright_green]✓[/bright_green]" if completed else "[bright_red]✗[/bright_red]"
        return "✓" if completed else "✗"
    
    def show_success(self, message: str) -> None:
        """
        Display success message.
        
        Args:
            message: Success message to display
        """
        if RICH_AVAILABLE:
            self.console.print(f"[bright_green]✓[/bright_green] {message}")
        else:
            print(f"✓ {message}")
    
    def show_error(self, error_type: str, reason: str) -> None:
        """
        Display error message with type and reason.
        
        Args:
            error_type: Type of error (e.g., "Validation Error", "Not Found")
            reason: Specific reason for the error
        """
        if RICH_AVAILABLE:
            self.console.print(f"[bright_red]✗ {error_type}:[/bright_red] {reason}")
        else:
            print(f"✗ {error_type}: {reason}")
    
    def show_ambiguous_id_error(self, prefix: str, matching_ids: List[str]) -> None:
        """
        Display error for ambiguous ID prefix.
        
        Args:
            prefix: The ambiguous prefix
            matching_ids: List of matching task IDs
        """
        short_ids = [id[:8] for id in matching_ids]
        self.show_error("Ambiguous ID", f"Prefix '{prefix}' matches multiple tasks: {', '.join(short_ids)}")
    
    def show_duplicate_warning(self, title: str) -> None:
        """
        Display warning for duplicate title.
        
        Args:
            title: The duplicate title
        """
        if RICH_AVAILABLE:
            self.console.print(f"[yellow]⚠ Warning:[/yellow] A task with title '{title}' already exists.")
        else:
            print(f"⚠ Warning: A task with title '{title}' already exists.")
    
    def show_empty_list(self) -> None:
        """Display message when no tasks exist."""
        if RICH_AVAILABLE:
            self.console.print("[bright_black]No tasks found. Use 'add' to create your first task.[/bright_black]")
        else:
            print("No tasks found. Use 'add' to create your first task.")
    
    def show_info(self, message: str) -> None:
        """
        Display informational message.
        
        Args:
            message: Info message to display
        """
        if RICH_AVAILABLE:
            self.console.print(f"[bright_cyan]ℹ[/bright_cyan] {message}")
        else:
            print(f"ℹ {message}")
