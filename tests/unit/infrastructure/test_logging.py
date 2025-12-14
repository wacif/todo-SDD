"""Unit tests for infrastructure logging."""

import logging
from src.infrastructure.logging.logger import setup_logger, app_logger


class TestLogging:
    """Test logging configuration."""

    def test_setup_logger_creates_logger(self):
        """Test that setup_logger creates a logger."""
        logger = setup_logger("test_logger")
        assert isinstance(logger, logging.Logger)
        assert logger.name == "test_logger"

    def test_setup_logger_default_level(self):
        """Test that default logging level is INFO."""
        logger = setup_logger("test_default_level")
        assert logger.level == logging.INFO

    def test_setup_logger_custom_level(self):
        """Test that custom logging level is applied."""
        logger = setup_logger("test_custom_level", level=logging.DEBUG)
        assert logger.level == logging.DEBUG

    def test_app_logger_exists(self):
        """Test that app_logger is configured."""
        assert isinstance(app_logger, logging.Logger)
        assert app_logger.name == "dobot"

    def test_logger_has_handler(self):
        """Test that logger has at least one handler."""
        logger = setup_logger("test_handler")
        assert len(logger.handlers) > 0

    def test_logger_no_duplicate_handlers(self):
        """Test that multiple calls don't create duplicate handlers."""
        logger = setup_logger("test_no_dup")
        handler_count = len(logger.handlers)
        # Call again
        setup_logger("test_no_dup")
        assert len(logger.handlers) == handler_count
