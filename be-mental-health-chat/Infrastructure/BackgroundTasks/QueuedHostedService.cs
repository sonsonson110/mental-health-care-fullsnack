using Infrastructure.BackgroundTasks.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.BackgroundTasks;

public class QueuedHostedService : BackgroundService
{
    private readonly ILogger<QueuedHostedService> _logger;
    private readonly IBackgroundTaskQueue _taskQueue;
    private readonly IServiceProvider _serviceProvider;

    public QueuedHostedService(IBackgroundTaskQueue taskQueue, IServiceProvider serviceProvider,
        ILogger<QueuedHostedService> logger)
    {
        _taskQueue = taskQueue;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Queued Hosted Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                using var scope = _serviceProvider.CreateScope();
                try
                {
                    await workItem(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing background work: {WorkItem}.", nameof(workItem));
                }
            }
            catch (OperationCanceledException)
            {
                // system shutdown
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred executing background work.");
            }
        }
    }
}