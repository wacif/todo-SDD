"""Unit tests for infrastructure configuration."""

from src.infrastructure.config.settings import Settings, settings


class TestSettings:
    """Test application settings."""

    def test_default_settings(self):
        """Test default settings values."""
        assert settings.app_name == "Todo App"
        assert settings.version == "0.1.0"
        assert settings.debug is False

    def test_custom_settings(self):
        """Test creating custom settings."""
        custom = Settings(app_name="Custom App", version="1.0.0", debug=True)
        assert custom.app_name == "Custom App"
        assert custom.version == "1.0.0"
        assert custom.debug is True

    def test_settings_immutable(self):
        """Test that settings are immutable (frozen dataclass)."""
        import pytest

        with pytest.raises(Exception):  # FrozenInstanceError in Python 3.10+
            settings.debug = True  # type: ignore
